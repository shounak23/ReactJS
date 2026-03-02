import React, { useState } from "react";
import { Heart, Sparkles, Send } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import "./proposalsite.css";
// import EmailService from "./emailService.jsx";
import emailjs from "@emailjs/browser";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function ProposalSite() {
  const [page, setPage] = useState("welcome");

  const emailService = async (subject, msg, to_email) => {
    debugger;
    try {
      const response = await emailjs.send(
        import.meta.env.VITE_YOUR_SERVICE_ID,
        import.meta.env.VITE_YOUR_TEMPLATE_ID,
        {
          subject,
          message: msg,
          to_email,
        },
        import.meta.env.VITE_YOUR_PUBLIC_KEY,
      );
      console.log("responce", response.status, response.text);
      toast.success("Email sent successfully 💌");
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send email ❌ connect to developer");
    }
  };

  const WelcomePage = () => {
    return (
      <div className="page-container welcome-page">
        <div className="floating-hearts">
          <Heart className="heart heart-1" />
          <Heart className="heart heart-2" />
          <Heart className="heart heart-3" />
          <Sparkles className="sparkle sparkle-1" />
          <Sparkles className="sparkle sparkle-2" />
        </div>

        <div className="content-wrapper fade-in">
          <h1 className="main-title">
            A Question
            <br />
            <span className="title-accent">From My Heart</span>
          </h1>

          <p className="welcome-text">
            There's something important I need to ask you...
          </p>

          <button onClick={() => setPage("view")} className="cta-button">
            <span>I'm Ready</span>
            <Heart className="button-icon" />
          </button>
        </div>
      </div>
    );
  };

  const ViewPage = () => {
    return (
      <div className="page-container welcome-page">
        <div className="floating-hearts">
          <Heart className="heart heart-1" />
          <Heart className="heart heart-2" />
          <Sparkles className="sparkle sparkle-1" />
        </div>

        <div className="content-wrapper fade-in view-page">
          <h2 className="response-title">Before I Ask You Anything</h2>

          <p className="welcome-text view-text">
            I will feel good if you speak in a way that makes you feel good.
            <br />
            <br />
            You don’t need to filter your thoughts for me.
            <br />
            <br />
            Speak your mind.
            <br />
            Speak from your heart.
            <br />
            <br />
            You are free to do things your way,
            <br />
            in your time,
            <br />
            in your comfort,
            <br />
            exactly how you want.
            <br />
            <br />
            All I want is honesty,
            <br />
            because your truth matters to me.
          </p>

          <button onClick={() => setPage("question")} className="cta-button">
            <span>Now I’m Ready</span>
            <Heart className="button-icon" />
          </button>
        </div>
      </div>
    );
  };

  const QuestionPage = () => {
    return (
      <div className="page-container question-page">
        <div className="floating-hearts">
          <Heart className="heart heart-1" />
          <Heart className="heart heart-2" />
        </div>

        <div className="content-wrapper fade-in">
          <h2 className="question-title">
            I want to be with you
            <br />
            for your <span className="highlight">whole life</span>
          </h2>

          <p className="question-subtitle">Can I?</p>

          <div className="button-group">
            <button
              onClick={() => setPage("yes")}
              className="choice-button yes-button"
            >
              <Heart className="button-icon" fill="currentColor" />
              Yes
            </button>

            <button
              onClick={() => setPage("no")}
              className="choice-button no-button"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };

  const YesPage = () => {
    const [message, setMessage] = useState("");

    return (
      <div className="page-container yes-page">
        <button className="back-button" onClick={() => setPage("welcome")}>
          <ArrowLeft className="back-button-icon" />
          Back
        </button>
        <>
          <div className="celebration-bg">
            {[...Array(20)].map((_, i) => (
              <Heart
                key={i}
                className={`celebration-heart heart-${i}`}
                fill="currentColor"
              />
            ))}
          </div>

          <div className="content-wrapper">
            <h2 className="response-title">
              You've made me
              <br />
              <span className="highlight">the happiest person!</span>
            </h2>

            <p className="response-subtitle">
              Tell me what you want from me as your partner,
              <br />
              or what I should change to be more perfect for you
            </p>

            <div className="message-box">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts with me..."
                className="message-input"
                rows="6"
              />

              <button
                onClick={() => {
                  if (message.trim()) {
                    emailService(
                      page,
                      message,
                      "shounakvideoediting@gmail.com",
                    );
                    setMessage("");
                  }
                }}
                className="send-button"
                disabled={!message.trim()}
              >
                <Send className="button-icon" />
                <span>Send My Thoughts</span>
              </button>
            </div>
          </div>
        </>
      </div>
    );
  };

  const NoPage = () => {
    const [message, setMessage] = useState("");
    return (
      <div className="page-container no-page">
        <button className="back-button" onClick={() => setPage("welcome")}>
          <ArrowLeft className="back-button-icon" />
          Back
        </button>
        <>
          <div className="content-wrapper fade-in">
            <h2 className="response-title sad">I understand...</h2>

            <p className="response-subtitle">
              Could you help me understand why?
              <br />
              Your honesty means everything to me
            </p>

            <div className="message-box">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please share your reasons..."
                className="message-input"
                rows="6"
              />

              <button
                onClick={() => {
                  if (message.trim()) {
                    emailService(
                      page,
                      message,
                      "shounakvideoediting@gmail.com",
                    );
                    toast(
                      "I respect your decision and appreciate your honesty.",
                      {
                        icon: "🤍",
                      },
                    );

                    setMessage("");
                  }
                }}
                className="send-button secondary"
                disabled={!message.trim()}
              >
                <Send className="button-icon" />
                <span>Share</span>
              </button>
            </div>

            <div className="apology-box">
              <p className="apology-text">
                I'm sorry if I made you uncomfortable or put you in a difficult
                position. Your feelings and happiness are what matter most to
                me. Thank you for being honest, and I hope we can still cherish
                the connection we have.
              </p>
            </div>
          </div>
        </>
      </div>
    );
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "16px",
          },
        }}
      />
      <div className="app-container">
        {page === "welcome" && <WelcomePage />}
        {page === "question" && <QuestionPage />}
        {page === "yes" && <YesPage />}
        {page === "no" && <NoPage />}
        {page === "view" && <ViewPage />}
      </div>
    </>
  );
}
