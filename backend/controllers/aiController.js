import { generateNovelContent, generateNovelTitle, generateNovelOutline, generateContentAnalysis, generateCharacterDevelopment } from '../utils/openai.js';
import { logger } from '../utils/logger.js';

// 生成小说内容
export const generateContent = async (req, res) => {
  try {
    const { prompt, context, options } = req.body;
    logger.info('生成小说内容请求', { prompt: prompt?.substring(0, 100), hasContext: !!context, hasOptions: !!options });

    // 验证输入
    if (!prompt) {
      logger.warn('生成小说内容缺少提示', { error: '请提供生成提示' });
      return res.status(400).json({ error: '请提供生成提示' });
    }

    // 调用 OpenAI 工具生成内容
    const result = await generateNovelContent(prompt, context, options);

    if (!result.success) {
      logger.error('生成小说内容失败', { error: result.error });
      return res.status(500).json({ error: result.error });
    }

    logger.info('生成小说内容成功', { contentLength: result.content?.length });
    res.status(200).json({ content: result.content });
  } catch (error) {
    logger.error('生成小说内容时出错', { error: error.message, stack: error.stack });
    res.status(500).json({ error: '生成内容时出错' });
  }
};

// 生成小说标题
export const generateTitle = async (req, res) => {
  try {
    const { prompt, options } = req.body;
    logger.info('生成小说标题请求', { prompt: prompt?.substring(0, 100), hasOptions: !!options });

    // 验证输入
    if (!prompt) {
      logger.warn('生成小说标题缺少提示', { error: '请提供生成提示' });
      return res.status(400).json({ error: '请提供生成提示' });
    }

    // 调用 OpenAI 工具生成标题
    const result = await generateNovelTitle(prompt, options);

    if (!result.success) {
      logger.error('生成小说标题失败', { error: result.error });
      return res.status(500).json({ error: result.error });
    }

    logger.info('生成小说标题成功', { title: result.title });
    res.status(200).json({ title: result.title });
  } catch (error) {
    logger.error('生成小说标题时出错', { error: error.message, stack: error.stack });
    res.status(500).json({ error: '生成标题时出错' });
  }
};

// 生成小说大纲
export const generateOutline = async (req, res) => {
  try {
    const { prompt, options } = req.body;
    logger.info('生成小说大纲请求', { prompt: prompt?.substring(0, 100), hasOptions: !!options });

    // 验证输入
    if (!prompt) {
      logger.warn('生成小说大纲缺少提示', { error: '请提供生成提示' });
      return res.status(400).json({ error: '请提供生成提示' });
    }

    // 调用 OpenAI 工具生成大纲
    const result = await generateNovelOutline(prompt, options);

    if (!result.success) {
      logger.error('生成小说大纲失败', { error: result.error });
      return res.status(500).json({ error: result.error });
    }

    logger.info('生成小说大纲成功', { outlineType: typeof result.outline });
    res.status(200).json({ outline: result.outline });
  } catch (error) {
    logger.error('生成小说大纲时出错', { error: error.message, stack: error.stack });
    res.status(500).json({ error: '生成大纲时出错' });
  }
};

// 分析小说内容
export const analyzeContent = async (req, res) => {
  try {
    const { content, options } = req.body;
    logger.info('分析小说内容请求', { contentLength: content?.length, hasOptions: !!options });

    // 验证输入
    if (!content) {
      logger.warn('分析小说内容缺少内容', { error: '请提供要分析的内容' });
      return res.status(400).json({ error: '请提供要分析的内容' });
    }

    // 调用 OpenAI 工具分析内容
    const result = await generateContentAnalysis(content, options);

    if (!result.success) {
      logger.error('分析小说内容失败', { error: result.error });
      return res.status(500).json({ error: result.error });
    }

    logger.info('分析小说内容成功', { analysisType: typeof result.analysis });
    res.status(200).json({ analysis: result.analysis });
  } catch (error) {
    logger.error('分析小说内容时出错', { error: error.message, stack: error.stack });
    res.status(500).json({ error: '分析内容时出错' });
  }
};

// 生成角色发展
export const generateCharacter = async (req, res) => {
  try {
    const { characterInfo, options } = req.body;
    logger.info('生成角色发展请求', { characterName: characterInfo?.name, hasOptions: !!options });

    // 验证输入
    if (!characterInfo) {
      logger.warn('生成角色发展缺少角色信息', { error: '请提供角色信息' });
      return res.status(400).json({ error: '请提供角色信息' });
    }

    // 调用 OpenAI 工具生成角色发展
    const result = await generateCharacterDevelopment(characterInfo, options);

    if (!result.success) {
      logger.error('生成角色发展失败', { error: result.error });
      return res.status(500).json({ error: result.error });
    }

    logger.info('生成角色发展成功', { characterName: result.character?.name });
    res.status(200).json({ character: result.character });
  } catch (error) {
    logger.error('生成角色发展时出错', { error: error.message, stack: error.stack });
    res.status(500).json({ error: '生成角色发展时出错' });
  }
};
