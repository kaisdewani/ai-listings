import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import Replicate from "replicate";
import { promises as fs } from "fs";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { image } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!image) {
      return new NextResponse("Image is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free trial has expired", {
        status: 403
      });
    }

    // Set MIME type for PNG image
    const mimeType = "image/png";
    // Create the data URI
    const dataURI = `data:${mimeType};base64,${image}`;

    const model =
      "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b";
    const input = {
      prompt:
        "A living room, simple style, simple furniture, daytime, super wide angle, photo level",
      image: dataURI
    };
    const output = await replicate.run(model, { input });

    await increaseApiLimit();
    console.log(output);
    return NextResponse.json(output);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
