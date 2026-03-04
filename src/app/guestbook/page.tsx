"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";

type GuestbookEntry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  image?: string;
};

const initialEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex Kim",
    email: "alex@example.com",
    message: "Excited to see how this starter evolves with a custom backend!",
    createdAt: "2026-02-01T14:00:00.000Z",
    image: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: "2",
    name: "Taylor Singh",
    email: "taylor@example.com",
    message:
      "Great UX so far. I’ll plug this into an Express API once it’s ready.",
    createdAt: "2026-01-28T09:30:00.000Z",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

export default function GuestBook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [entries]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setEntries((prev) => [
      {
        id: crypto.randomUUID(),
        name: name.trim() || "Anonymous",
        email: email.trim() || "Not provided",
        message: trimmed,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setMessage("");
  };

  return (
    <Card className="mx-auto mt-4 max-w-2xl">
      <CardBody className="gap-4">
        <div className="text-center">
          <h1 className="text-5xl">Guestbook</h1>
          <p className="text-default-500">
            Frontend-only demo. Hook these interactions to your Express +
            TypeScript API whenever you’re ready.
          </p>
        </div>

        <form
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <Input
            label="Name"
            placeholder="Optional"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            placeholder="Optional"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            label="Message"
            placeholder="Share a quick note"
            className="sm:col-span-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" color="primary">
              Add entry
            </Button>
          </div>
        </form>

        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="m-2">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={entry.image}
                  showFallback
                />
                <div className="flex flex-col items-start justify-center gap-1">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {entry.name}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    {entry.email}
                  </h5>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p>{entry.message}</p>
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex gap-1">
                <p className="text-small text-default-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </CardBody>
    </Card>
  );
}
