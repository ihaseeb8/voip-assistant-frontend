# VoIP Assistant: Front-End

This is the front-end application for **VoIP Assistant**, a customer support platform built with **Next.js**. The platform enables real-time communication through SMS, images, voice messages (VM), and calls, integrating Twilio for VoIP services and OpenAI’s ChatGPT for automated responses.

![Project-Image](https://github.com/user-attachments/assets/0f60ee7a-2d6c-4a38-adc9-9dd868a1db78)

## Project Overview

**VoIP Assistant** allows customer support agents to seamlessly manage communications with customers through an intuitive user interface. Key features include:

- Real-time interaction with customers via SMS, voice messages, images, and calls.
- Integration with **Twilio** for handling VoIP services.
- Automated responses through **OpenAI’s ChatGPT** for SMS and voice message replies.
- A user-friendly UI that lets agents manage conversations, toggle the ChatBot on/off, and intervene in real-time.
- Integration with **AWS** to host the ChatBot and a custom database for storing conversations, media, and call history.
- Email notifications for critical updates or changes in customer interactions.

## Getting Started

To run the front-end locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/ihaseeb8/voip-assistant-frontend
    cd voip-assistant-frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

The application will auto-refresh as you make edits to the code.

## Features

- **Agent Dashboard:** An intuitive interface for customer support agents to view and manage ongoing conversations.
- **Real-Time ChatBot Toggle:** Easily enable or disable the ChatBot to handle customer interactions automatically.
- **Media Handling:** Customers can send SMS, images, voice messages, and make calls, which are managed by the system.
- **Real-Time Agent Interventions:** Agents can take over conversations when needed, providing personalized support.
- **Notification System:** Critical updates or interactions are sent as email notifications to keep agents informed.
  
## Technologies Used

- **Next.js:** A React-based framework used to build the front-end.
- **Twilio:** Integrated for VoIP services to handle customer calls, SMS, and multimedia messages.
- **OpenAI ChatGPT:** Used to automate responses to customer SMS and voice messages.
- **AWS:** Hosts the ChatBot and handles data storage.
- **Custom Database:** Stores conversations, call history, images, and voice messages.

## Deployment

To deploy this project on Vercel, follow the steps below:

1. Create a Vercel account and link it to your GitHub repository.
2. Deploy directly from the Vercel platform by following their step-by-step guide.

For more details, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment).


