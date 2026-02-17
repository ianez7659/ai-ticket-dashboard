"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const submitTicket = async () => {
    // Validate all fields are filled and not just whitespace
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      alert("Please enter your name");
      return;
    }
    if (!trimmedEmail) {
      alert("Please enter your email");
      return;
    }
    if (!trimmedTitle) {
      alert("Please enter an issue title");
      return;
    }
    if (!trimmedDescription) {
      alert("Please describe your issue");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const params = new URLSearchParams({
        title: trimmedTitle,
        description: trimmedDescription,
        name: trimmedName,
        email: trimmedEmail,
      });

      const response = await fetch(
        `${API_URL}/tickets?${params.toString()}`,
        { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTitle("");
      setDescription("");
      setName("");
      setEmail("");
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert(`Failed to submit ticket. Please check if the backend server is running. Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI-Powered Customer Support Center
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Submit a ticket and manage responses with AI assistance
            </p>
          </div>

          {/* Ticket Form */}
          <Card id="ticket-form" className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                placeholder="Issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Textarea
                placeholder="Describe your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <Button className="w-full" onClick={submitTicket}>
                Submit Ticket
              </Button>

              {success && (
                <p className="text-green-600 text-sm text-center">
                  Ticket submitted successfully
                </p>
              )}
            </CardContent>
          </Card>

          {/* Admin Demo Login */}
          <div className="text-center space-y-3">
            <div className="inline-block">
              <p className="text-gray-600 mb-3 text-sm">
                Want to explore the admin dashboard? Login with the following password: admin123
              </p>
              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 font-semibold w-full"
                  size="lg"
                >
                  Admin Demo Login
                </Button>
              </Link>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg w-full mt-3">
                <p className="text-sm text-blue-800 text-center">
                  <span className="font-semibold">Admin demo password:</span> <code className="bg-blue-100 px-2 py-1 rounded">admin123</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
