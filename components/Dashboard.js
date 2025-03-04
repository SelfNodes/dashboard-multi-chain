"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AxelarQueryAPI } from "@axelar-network/axelarjs-sdk";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [axelarInfo, setAxelarInfo] = useState(null);
  const [chartData, setChartData] = useState([]);

  function generateChartData() {
    try {
      const data = Array.from({ length: 5 }, (_, i) => ({
        name: `Jour ${i + 1}`,
        value: Math.floor(Math.random() * 100),
      }));
      setChartData(data);
    } catch (error) {
      console.error("Erreur lors de la génération des données du graphique :", error);
    }
  }

  useEffect(() => {
    try {
      generateChartData();
      if (wallet) {
        getEthereumBalance(wallet);
        getAxelarInfo();
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation du Dashboard :", error);
    }
  }, [wallet]);

  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWallet(accounts[0]);
      } catch (error) {
        console.error("Erreur lors de la connexion au portefeuille :", error);
      }
    } else {
      alert("Metamask non détecté");
    }
  }

  async function getEthereumBalance(address) {
    try {
      const provider = new ethers.providers.InfuraProvider("homestead", "YOUR_INFURA_API_KEY");
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Erreur lors de la récupération du solde Ethereum :", error);
    }
  }

  async function getAxelarInfo() {
    try {
      const api = new AxelarQueryAPI();
      const status = await api.getStatus();
      setAxelarInfo(status);
    } catch (error) {
      console.error("Erreur lors de la récupération des infos Axelar :", error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard Multi-Chain</h1>
      <Button onClick={connectWallet}>Connect Wallet</Button>
      {wallet && <p>Wallet connecté : {wallet}</p>}
      {balance && <p>Solde Ethereum : {balance} ETH</p>}
      {axelarInfo && <p>Statut Axelar : {JSON.stringify(axelarInfo)}</p>}

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-lg font-bold">Performances du Validateur</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>Chargement des données...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

