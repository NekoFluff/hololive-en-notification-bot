import xml2js from "xml2js";
const parser = new xml2js.Parser();
import { DiscordMessenger } from "discord-messenger";

const messenger = DiscordMessenger.getMessenger();

export type FeedData = {
  author: string;
  authorURL: string;
  title: string;
  link: string;
  published: string;
  updated: string;
};

async function parseYoutubeXMLIntoFeedData(xml: string | Buffer) {
  try {
    const result = await parser.parseStringPromise(xml);
    const feed = result["feed"];

    console.log("Feed Entry:", feed.entry);
    if (feed.entry.length > 0) {
      const entry = feed.entry[0];

      const feedData: FeedData = {
        author: entry.author[0].name[0],
        authorURL: entry.author[0].uri[0],
        title: entry.title[0],
        link: entry.link[0]["$"].href,
        published: entry.published[0],
        updated: entry.updated[0],
      };

      messenger.transmitDeveloperNotification(
        `Feed data parsed.\nAuthor: ${feedData.author}\nTitle: ${feedData.title}\nLink: ${feedData.link}`
      );

      return feedData;
    }
  } catch (e) {
    messenger.transmitDeveloperNotification("Parsing Error: " + e.toString());
  }

  return null;
}

export default parseYoutubeXMLIntoFeedData;
