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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-gray-500 mt-2">
            Submit your issue and our team will respond quickly
          </p>
        </div>

        <Card>
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
              <p className="text-green-600 text-sm">
                Ticket submitted successfully
              </p>
            )}
          </CardContent>
        </Card>

        {/* admin login */}
        <div className="text-center">
          <Link href="/login" className="text-sm text-gray-500 underline">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
