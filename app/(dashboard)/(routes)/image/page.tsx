"use client"
import * as z from "zod";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import axios from "axios";
import { Copy, MessagesSquare } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Heading } from "@/components/heading";

const ImagePage = () => {
  const [images, setImages] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [response, setResponse] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setImages(undefined)
      setImageUrl(undefined); // Reset imageUrl when a new request is made

      if (!selectedFile) {
        throw new Error("No file provided");
      }

      // Create a new FileReader object
      const reader = new FileReader();

      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];  // Get only the Base64 string

          const response = await axios.post("/api/image", {
            image: base64String,
          });

          // Get the URLs from the response
          const urls = response.data;
          setImageUrl(urls[1]); // Save the URL of the second image
          setIsLoading(false);
        }
      };

      reader.readAsDataURL(selectedFile);

    } catch (error: any) {
      console.log(error);
    } finally {
      setSelectedFile(undefined);  // Reset the selected file
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: undefined
    }
  });


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied!');
    } catch (err) {
      alert('Failed to copy text');
    }
  };




  return (

    <div>
      <div>
        <Heading
          title="Inspiration"
          description="Upload a photo to get some inspiration"
          icon={MessagesSquare}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
      </div>
      {/* ... */}
      <div className="px-4 lg:px-8">
        <form
          onSubmit={onSubmit}
          className="
          rounded-lg
          border
          w-full
          p-4
          px-3
          md:px-6
          foucs-within:shadow-sm
          grid
          grid-cols-12
          gap-2
        "
        >
          <div className="col-span-12 lg:col-span-10 p-4 rounded-lg border w-full">
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isLoading}
              className="border-2 border-gray-300 p-2 rounded-md"
            />
          </div>
          <Button
            className="col-span-12 lg:col-span-2 w-full mt-4"
            disabled={isLoading}
            type="submit"
          >
            Generate
          </Button>
        </form>
      </div>
      {isLoading && (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
          <Loader />
        </div>
      )}
      {response && response.error && ( // Display any errors in the API response
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-red-500 text-white">
          {response.error}
        </div>
      )}
      {imageUrl && (
        <div className="mt-4">
          <img className="p-8 rounded-lg" src={imageUrl} alt="Generated output" />
        </div>
      )}
    </div>
  );
};

export default ImagePage;
