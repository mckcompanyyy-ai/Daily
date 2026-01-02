
import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyCoachSuggestions = async (currentTasks: Task[]) => {
  const prompt = `Şu görevlere dayanarak: ${JSON.stringify(currentTasks)}. 
  Üretkenliğimi veya refahımı optimize etmek için 3 yol öner. Kısa, motive edici ve tamamen Türkçe olsun.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const getDailyQuote = async () => {
  const dateStr = new Date().toLocaleDateString('tr-TR');
  const prompt = `Bugün (${dateStr}) için benzersiz bir günlük motivasyon sözü sağla. 
  Yazarı (ünlü yazar, filozof veya tarihi figür) dahil et. 
  Format şu şekilde olsun: "Alıntı" - Yazar. Kısa ve etkileyici olsun. Yanıt tamamen Türkçe olmalı.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateSummary = async (tasks: Task[]) => {
  const completed = tasks.filter(t => t.completed);
  const missed = tasks.filter(t => !t.completed);
  
  const prompt = `Bugünkü performansımı analiz et ve özetle. 
  Tamamlanan: ${completed.map(t => t.title).join(', ')}. 
  Yapılamayan: ${missed.map(t => t.title).join(', ')}.
  Önemli Kurallar:
  1. Yanıt en fazla 3-4 satır olmalı.
  2. Her seferinde farklı bir üslup (şairane, profesyonel, neşeli veya ciddi) kullan.
  3. Yanıt tamamen Türkçe olmalı.
  4. Yarın için tek bir odak noktası öner.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const createTaskFromPrompt = async (userInput: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Bu kullanıcı girişini bir görev nesnesine dönüştür. Giriş: "${userInput}". Kategori değerleri şunlardan biri olmalı: ${Object.values(TaskCategory).join(', ')}. Yanıt geçerli bir JSON olmalıdır.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          startTime: { type: Type.STRING, description: "Format HH:mm" },
          durationMinutes: { type: Type.NUMBER },
          category: { 
            type: Type.STRING, 
            enum: Object.values(TaskCategory) 
          }
        },
        required: ["title", "startTime", "durationMinutes", "category"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Gemini görev yanıtı ayrıştırılamadı", e);
    return null;
  }
};
