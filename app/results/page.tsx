"use client";
import { signInAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import todovexLogo from "@/public/logo/todovex.svg";
import clsx from "clsx";
import { Loader, StepForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useFormStatus } from "react-dom";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card" // Assuming you're using ShadCN and its card components.

// Define the data type
// Define the data type
type Ticket = {
    id: string;
    price: number;
    source: string;
    seat_section: string;
    seat_row: number;
  };
  
  const sampleData: Ticket[] = [
    { id: "1", price: 100, source: "link to place", seat_section: "A", seat_row: 1 }
  ];
  
  const TicketTable: React.FC = () => {
    const handleButtonClick = (id: string) => {
      alert(`Ticket ID: ${id}`);
    };
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Row</th>
              <th className="border border-gray-300 px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((Ticket) => (
              <tr key={Ticket.id}>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Ticket.price)}
                </td>
                <td className="border border-gray-300 px-4 py-2">{Ticket.seat_section}</td>
                <td className="border border-gray-300 px-4 py-2">{Ticket.seat_row}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleButtonClick(Ticket.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Ticket Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const Page: React.FC = () => {
    return (
      <div className="p-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0"> {/* Responsive layout: column on small screens, row on large screens */}
        <div className="lg:w-2/3">
          <h1 className="text-2xl font-bold mb-4">Ticket Data</h1>
          <TicketTable />
        </div>
  
        {/* ShadCN Card Component */}
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Here is a summary of your ticket data. You can view and manage the details from here.</p>
            </CardContent>
            <CardFooter>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Manage Tickets
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };
  
  export default Page;