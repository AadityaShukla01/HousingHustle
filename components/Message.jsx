"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useMessageContext } from "@/context/MessageContext";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(false);
  const { setCount } = useMessageContext();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages`
        );

        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        } else {
          console.log(error);
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        setRead((pre) => !pre);
        toast.error("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleRead = async (id) => {
    try {
      const data = {
        ...messages[id],
        sender: messages[id].sender._id,
        property: messages[id].property._id,
        read: true,
      };

      const messageId = messages[id]._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        setCount((pre) => pre - 1);
        toast.success("Message marked read");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const messageId = messages[id]._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success(await res.json().message);
        let newMessages = messages.filter((id) => id !== messageId);
        setMessages(newMessages);
      }
    } catch (error) {
      console.log(error);
      toast.error(await res.json().message);
    }
  };
  return (
    <>
      {!loading && (
        <section className="bg-blue-50">
          <div className="container m-auto py-24 max-w-6xl">
            <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 flex flex-col gap-8">
              <h1 className="text-3xl font-bold mb-4 gap text-center">
                Your Messages
              </h1>
              {messages.map((item, index) => (
                <div key={index}>
                  <div className="space-y-4">
                    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
                      <h2 className="text-xl mb-4">
                        <span className="font-bold">Property Inquiry: </span>
                        {item.property.name}
                      </h2>
                      <p className="text-gray-700">{item.body}</p>

                      <ul className="mt-4">
                        <li>
                          <strong>Name:</strong> &nbsp;{item.sender.username}
                        </li>

                        <li>
                          <strong>Reply Email:</strong>
                          <a
                            href={`mailto:${item.email}`}
                            className="text-blue-500"
                          >
                            &nbsp; {item.email}
                          </a>
                        </li>
                        <li>
                          <strong>Reply Phone:</strong>
                          <a
                            href={`tel:${item.phone}`}
                            className="text-blue-500"
                          >
                            &nbsp; {item.phone}
                          </a>
                        </li>
                        <li>
                          <strong>Received:</strong> &nbsp;
                          {new Date(item.createdAt).toLocaleString()}
                        </li>
                      </ul>
                      <button
                        className={`mt-4 mr-3 ${
                          !item.read ? "bg-blue-600" : "bg-gray-400"
                        } text-white py-1 px-3 rounded-md`}
                        disabled={item.read}
                        onClick={() => handleRead(index)}
                      >
                        Mark As Read
                      </button>
                      <button
                        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Message;
