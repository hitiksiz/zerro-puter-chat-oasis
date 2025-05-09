
// Simple emotion detector based on keywords and emojis
const emotions = {
  happy: ["happy", "glad", "joy", "excited", "excellent", "great", "wonderful", "😊", "😄", "🙂", "😁", "🥳"],
  sad: ["sad", "unhappy", "disappointed", "depressed", "upset", "😢", "😭", "😔", "🙁", "😞"],
  angry: ["angry", "mad", "furious", "irritated", "annoyed", "😠", "😡", "🤬", "😤"],
  surprised: ["surprised", "shocked", "amazed", "wow", "😲", "😯", "😮", "😱"],
  confused: ["confused", "unsure", "don't understand", "unclear", "🤔", "😕", "❓", "🤷‍♂️", "🤷‍♀️"],
  grateful: ["thanks", "thank you", "grateful", "appreciate", "appreciated", "🙏", "👍", "❤️"],
};

export const detectEmotions = (text: string): string[] => {
  const result: string[] = [];
  const lowercaseText = text.toLowerCase();

  Object.entries(emotions).forEach(([emotion, keywords]) => {
    for (const keyword of keywords) {
      if (lowercaseText.includes(keyword.toLowerCase())) {
        if (!result.includes(emotion)) {
          result.push(emotion);
        }
        break;
      }
    }
  });

  return result;
};

// Return appropriate emoji response based on detected emotions
export const getEmotionResponse = (detectedEmotions: string[]): string => {
  if (detectedEmotions.includes("happy")) {
    return "I'm glad you're feeling good! 😊";
  } else if (detectedEmotions.includes("sad")) {
    return "I'm sorry to hear that you're feeling down. How can I help? 🌷";
  } else if (detectedEmotions.includes("angry")) {
    return "I understand you're frustrated. Let's work through this. 🧘";
  } else if (detectedEmotions.includes("confused")) {
    return "I'll try to explain more clearly. 🔍";
  } else if (detectedEmotions.includes("grateful")) {
    return "You're very welcome! 😊";
  } else if (detectedEmotions.includes("surprised")) {
    return "Surprising, isn't it? 😲";
  }
  return "";
};
