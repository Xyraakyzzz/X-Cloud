/*
  Note: Text2Image Generator
  Create: t.me/IkyyExecutive
  Group: t.me/SawitRamadhan
*/

const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new CookieJar();

const client = wrapper(
  axios.create({
    jar,
    withCredentials: true,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Origin: "https://www.template.net",
      Referer: "https://www.template.net/",
    },
  })
);

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function upload(imageUrl) {
  try {
    const { data } = await axios.post(
      "https://cdnn.ikyyxd.my.id/api/upload.php",
      {
        url: imageUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    return data.url;
  } catch (err) {
    return null;
  }
}

async function generateImage(prompt) {
  try {
    const generateRes = await client.post(
      "https://ai-tool-service.template.net/api/v2/image-generate-by-model",
      {
        aspect_ratio: "9:16", //sesuaikan
        countryCode: "ID",
        from: "/ai-image-generator",
        model: "flux-1.1",
        prompt,
        sampleCount: 1,
      }
    );

    const jobId = generateRes.data?.jobId;

    if (!jobId) {
      return console.log(
        JSON.stringify(
          {
            success: false,
            error: "jobId not found",
          },
          null,
          2
        )
      );
    }

    while (true) {
      await sleep(2000);

      const statusRes = await client.get(
        `https://ai-tool-service.template.net/api/v2/image-generation/status/${jobId}`
      );

      const data = statusRes.data;

      if (data.status === "completed") {
        const originalImage =
          data.data?.urls?.[0];

        const cdnImage =
          await upload(originalImage);

        return console.log(
          JSON.stringify(
            {
              success: true,
              prompt,
              jobId,
              image: cdnImage,
            },
            null,
            2
          )
        );
      }

      if (data.status === "failed") {
        return console.log(
          JSON.stringify(
            {
              success: false,
              error: "Generation failed",
            },
            null,
            2
          )
        );
      }
    }
  } catch (err) {
    console.log(
      JSON.stringify(
        {
          success: false,
          error:
            err.response?.data ||
            err.message,
        },
        null,
        2
      )
    );
  }
}

// prompt
generateImage(
  "The Cat With the Blue Hat"
);