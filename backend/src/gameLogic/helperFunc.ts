import { distance } from "fastest-levenshtein";
import { WebSocket } from "ws";
import { messageTypes } from "../types";
import Groq from "groq-sdk";
const Token = process.env.GROQ_TOKEN;

export function fuzzyCheck(actual: string, typed: string): number {
  const dis = distance(typed, actual);
  return dis;
}

export function sendJSON(ws: WebSocket, obj: messageTypes) {
  ws.send(JSON.stringify(obj));
}

const groq = new Groq({ apiKey: Token });

export async function generatePara(time: number) {
  const chatCompletion = await getGroqChatCompletion(String(time));
  // Print the completion returned by the LLM.
  console.log(chatCompletion);
  return chatCompletion;
}

export async function getGroqChatCompletion(time: string) {
  const authors = [
    "Nietzsche",
    "kafka",
    "sartre",
    "Dostoevsky",
    "Albert Camus",
    "Sylvia Plath",
    "George Orwell",
    "Jiddu Krishnamurti",
    "Osho",
    "Anton-Chekhov",
    "Plato",
  ];
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
  console.log("🧠 Today's philosopher of chaos is:", randomAuthor);

  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate a text piece for a typing test as fast as you can. It must be composed exclusively of words and phrasing used by ${randomAuthor} in their original works and should contain no punctuation marks. The text should be long enough if the player types at 70wpm for ${time} seconds. Keep it meaningful and consistent with the author and dont write anything except than the text piece.`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
  const text = res?.choices?.[0]?.message.content ?? "[No output text]";
  console.log(text);
  return text;
}
