import { generateNovelContent, generateNovelTitle, generateNovelOutline } from '../utils/openai.js';

// 生成小说内容
export const generateContent = async (req, res) => {
  try {
    const { prompt, context, options } = req.body;

    // 验证输入
    if (!prompt) {
      return res.status(400).json({ error: '请提供生成提示' });
    }

    // 调用 OpenAI 工具生成内容
    const result = await generateNovelContent(prompt, context, options);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ content: result.content });
  } catch (error) {
    res.status(500).json({ error: '生成内容时出错' });
  }
};

// 生成小说标题
export const generateTitle = async (req, res) => {
  try {
    const { prompt, options } = req.body;

    // 验证输入
    if (!prompt) {
      return res.status(400).json({ error: '请提供生成提示' });
    }

    // 调用 OpenAI 工具生成标题
    const result = await generateNovelTitle(prompt, options);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ title: result.title });
  } catch (error) {
    res.status(500).json({ error: '生成标题时出错' });
  }
};

// 生成小说大纲
export const generateOutline = async (req, res) => {
  try {
    const { prompt, options } = req.body;

    // 验证输入
    if (!prompt) {
      return res.status(400).json({ error: '请提供生成提示' });
    }

    // 调用 OpenAI 工具生成大纲
    const result = await generateNovelOutline(prompt, options);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ outline: result.outline });
  } catch (error) {
    res.status(500).json({ error: '生成大纲时出错' });
  }
};
