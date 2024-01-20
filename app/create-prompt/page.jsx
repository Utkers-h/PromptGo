"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });

  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if the prompt already exists in the database
      const promptExists = await checkPromptExists(post.prompt);

      if (promptExists) {
        window.alert('Warning: Prompt already exists!!');
      } else {
        // If the prompt doesn't exist, proceed with creating a new prompt
        const response = await fetch("/api/prompt/new", {
          method: "POST",
          body: JSON.stringify({
            prompt: post.prompt,
            userId: session?.user.id,
            tag: post.tag,
          }),
        });

        if (response.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to check if the prompt already exists
  const checkPromptExists = async (userPrompt) => {
    try {
      const response = await fetch("/api/prompt/check", {
        method: "POST",
        body: JSON.stringify({
          prompt: userPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      } else {
        console.error('Error checking prompt existence');
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <Form
      type='Create'
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
