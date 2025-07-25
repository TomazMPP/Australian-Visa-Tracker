import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const CryptoAddress = ({ chain, address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="font-medium text-gray-700 dark:text-gray-300">{chain}</div>
      <div className="flex items-center gap-2">
        <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm flex-1 overflow-x-auto">
          {address}
        </code>
        <button
          onClick={handleCopy}
          className="p-2 bg-white dark:bg-black hover:bg-slate-300 dark:hover:bg-gray-800 rounded-full transition-colors"
          title="Copy address"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const DonationPage = () => {
  // SEO Configuration for Donation Page
  useSEO({
    title: 'Support Australian Visa Tracker - Donate to Keep It Free | Australian Visa Tracker',
    description: 'Support the Australian Visa Tracker project and help keep this valuable resource free for everyone. Learn about our mission and upcoming projects.',
    keywords: 'support Australian visa tracker, donate, Australian visa processing times, free visa tools, community support, visa tracker funding',
    image: 'https://www.australianvisatracker.com/images/og-image.jpg',
    url: 'https://www.australianvisatracker.com/donate',
    canonical: 'https://www.australianvisatracker.com/donate',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Support This Project",
      "description": "Support the Australian Visa Tracker project and help keep this valuable resource free for everyone.",
      "url": "https://www.australianvisatracker.com/donate",
      "mainEntity": {
        "@type": "Organization",
        "name": "Australian Visa Tracker",
        "description": "Free tool for tracking Australian visa processing times",
        "url": "https://www.australianvisatracker.com/",
        "foundingDate": "2024",
        "knowsAbout": [
          "Australian visa processing times",
          "Immigration to Australia",
          "Visa application tracking"
        ],
        "sameAs": [
          "https://patreon.com/tomazmpp"
        ]
      },
      "potentialAction": {
        "@type": "DonateAction",
        "target": "https://patreon.com/tomazmpp",
        "recipient": {
          "@type": "Organization",
          "name": "Australian Visa Tracker"
        }
      }
    }
  });

  // Custom breadcrumbs for this page
  const customBreadcrumbs = [
    { label: 'Support Project', path: '/donate' }
  ];

  const cryptoAddresses = [
    {
      chain: "Bitcoin (BTC)",
      address: "--"
    },
    {
      chain: "Ethereum or Polygon",
      address: "--"
    },
    {
      chain: "Solana",
      address: "--"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl">
      <Breadcrumbs customCrumbs={customBreadcrumbs} />
      
      <header>
        <h1 className="text-5xl font-bold text-center mb-8 dark:text-white">
          Support This Project 💝
        </h1>
      </header>
      
      <main className="space-y-8">
        <Card className="dark:bg-gray-900/50 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-medium dark:text-gray-100">
              About the Visa Processing Times Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600 dark:text-gray-300 text-left">
            <p>
              I created this project with a clear mission: to simplify access to Australian visa 
              processing time information. On our very first day of launch, we reached over 8,000 
              visitors, demonstrating the real need for this tool in the community.
            </p>
            <p>
              To keep the website running reliably, I have a fixed monthly cost of AUD $16 
              (approximately USD $10) for servers and infrastructure. This investment ensures the 
              service remains stable and accessible to everyone who needs it.
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900/50 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-medium dark:text-gray-100">
              Upcoming Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600 dark:text-gray-300 text-left">
            <p>
              Beyond this visa processing times website, I'm developing what will be the most 
              comprehensive Australian cost of living simulator. This new project will bring unique 
              features that no other similar tool currently offers, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Detailed comparisons between different cities and regions</li>
              <li>Personalized calculations based on your lifestyle</li>
              <li>Regularly updated data from official sources</li>
              <li>Integration with job market information</li>
            </ul>
            <p className="mt-4">
              My commitment is to continue developing high-quality, free tools to help people 
              planning their move to Australia. Each project is designed to address real needs 
              and make the migration process more transparent and accessible.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 dark:border-purple-800/50">
          <CardHeader>
            <CardTitle className="text-2xl font-medium dark:text-gray-100 text-center">
              Support This Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-700 dark:text-gray-300">
              Your contribution helps keep these projects free and continuously improving for everyone.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg"
                onClick={() => window.open('https://patreon.com/tomazmpp?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink', '_blank')}
              >
                Make a Donation 💝
              </Button>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Any amount is welcome and greatly appreciated!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 dark:border-purple-800/50">
          <CardHeader>
            <CardTitle className="text-2xl font-medium dark:text-gray-100 text-center">
              Crypto Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-700 dark:text-gray-300">
              Prefer to donate using cryptocurrency? You can use any of these addresses:
            </p>
            <div className="space-y-6">
              {cryptoAddresses.map((crypto, index) => (
                <CryptoAddress 
                  key={index}
                  chain={crypto.chain}
                  address={crypto.address}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DonationPage;
