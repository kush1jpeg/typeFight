import type { messageTypes } from "../types";
import { useRoomStore } from "./zustand";
import { set_toast } from "./components/toast";
import { useSocketStore } from "./components/socket";
import { navigateTo } from "./navigate";

export function handleIncoming(data: messageTypes) {
  const sendWs = useSocketStore.getState().send;
  const setMode = useRoomStore.getState().setMode;
  const set_Sentence = useRoomStore.getState().setSentence;
  const set_Opponent = useRoomStore.getState().setOpponent;
  const setOpp_cursor = useRoomStore.getState().setOpp_cursor;
  const setMistake = useRoomStore.getState().setMistake;
  const setWinner = useRoomStore.getState().setWinner;
  const set_playerPing = useRoomStore.getState().set_player_ping;
  const set_oppPing = useRoomStore.getState().set_opp_ping;
  const settime = useRoomStore.getState().settime;
  const set_playerId = useRoomStore.getState().setgamerId;
  const playerId = useRoomStore.getState().gamerId;
  switch (data.type) {
    case "RECONNECT_SUCCESS":
      {
        setOpp_cursor(data.player.oppCursor);
        set_Opponent(data.player.oppId);
        set_playerId(data.player.gamerId);
        useRoomStore.getState().setStart(true);
        settime(data.player.timeLeft);
      }
      break;
    case "UUID-SET":
      {
        localStorage.setItem("playerUUID", data.uuid);
        console.log("uuid stored in localStorage");
      }
      break;

    case "FEEDBACK":
      {
        // for only when player joins an existing room
        if (data.code === "ROOM_JOIN") {
          set_toast(data.msg, "success");
          useRoomStore.getState().setJoined(true);
          return;
        }
        if (data.code === "OPP_JOINED") {
          set_toast(data.msg, "info");
          useRoomStore.getState().setJoined(true);
          return;
        }

        if (data.code === "ROOM_CREATED") {
          console.log("room created");
          set_toast(data.code, "success");
          return;
        }

        // for the round start when all the players are ready
        if (data.code === "ROUND_START") {
          set_toast(data.msg, "success");
          useRoomStore.getState().setStart(true);
          return;
        }
        if (data.code === "ROOM_FULL") {
          set_toast(data.msg, "warn");
          useRoomStore.getState().reset();
          setMode("select");
          return;
        }
        if (data.code === "ROOM_DELETED") {
          set_toast(data.msg, "warn");
          useRoomStore.getState().reset();
          navigateTo("/");
          return;
        }
        set_toast(data.msg, "info");
      }
      break;

    case "TOKEN_PING":
      {
        //pong to be be send as it came like-
        sendWs({ type: "TOKEN_PONG", timestamp: data.timestamp });
      }
      break;

    case "SERVER_MESSAGE":
      {
        useRoomStore.getState().showTaunt(data.msg);
      }
      break;

    case "ROOM_INFO":
      {
        if (playerId === data.player1 || playerId === data.player2) {
          set_Opponent(data.player1 === playerId ? data.player2 : data.player1);
          set_Sentence(data.sentence);
        }
      }
      break;

    case "ROUND_END":
      {
        console.log("received round end in frontend");
        setWinner(data.winnerId);
      }
      break;

    case "GAME_RES":
      {
        console.log("received gameRes");
        setOpp_cursor(data.data.index);
        setMistake(data.data.status);
      }
      break;

    case "PING_UPDATE":
      {
        console.log("received ping update");
        set_oppPing(data.opponent);
        set_playerPing(data.player);
      }
      break;

    case "TIME_UPDATE":
      {
        console.log("ontimeupdate");
        settime(data.remaining);
      }
      break;

    //i dont need  this in frontend like cases- shitted will send it as soon as a person clicks fucking join
  }
}
