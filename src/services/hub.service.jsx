import * as signalR from "@microsoft/signalr";
import { baseURL } from "../httpClient/httpClient";
class HubService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseURL}/userStateHub`, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.connection.onclose(this.onClose.bind(this));
    this.connection.on("UserDisabled", this.handleUserDisabled.bind(this));
  }
  async start() {
    try {
      if (this.connection.state !== signalR.HubConnectionState.Connected) {
        await this.connection.start();
      }
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("Error while starting connection: ", err);
      setTimeout(() => this.start(), 5000); // Retry connection after 5 seconds
    }
  }
  onClose() {
    console.log("SignalR Disconnected.");
    setTimeout(() => this.start(), 5000); // Retry connection after 5 seconds
  }
  on(event, callback) {
    this.connection.on(event, callback);
  }
  off(event, callback) {
    this.connection.off(event, callback);
  }
  async send(event, data) {
    try {
      if (this.connection.state === signalR.HubConnectionState.Connected) {
        await this.connection.invoke(event, data);
      }
    } catch (err) {
      console.error("Error while sending data: ", err);
    }
  }
  handleUserDisabled() {
    console.log("User has been disabled.");
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  }
}

export const hubService = new HubService();
