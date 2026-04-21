import OpenAI from 'openai';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-api-key' // 使用环境变量或模拟密钥
});

// 生成小说内容
export async function generateNovelContent(prompt, options = {}) {
  try {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
      // 模拟生成内容
      const mockResponses = [
        "在一个遥远的王国里，有一位勇敢的骑士。他骑着一匹白色的战马，手持锋利的长剑，正前往黑暗森林寻找被绑架的公主。森林里充满了危险，但骑士毫不畏惧，因为他心中充满了对公主的爱。",
        "未来世界，人类已经殖民了火星。年轻的科学家莉娜发现了一个神秘的地下洞穴，里面藏着一个古老的外星文明遗迹。她决定深入探索，揭开这个星球的秘密。",
        "古代中国，一位年轻的书生上京赶考。途中，他遇到了一位美丽的狐仙，两人之间发生了一段跨越人妖界限的爱情故事。",
        "现代都市，一位普通的上班族发现自己拥有了看透人心的能力。他开始利用这个能力帮助别人，但很快发现这个能力也给他带来了麻烦。",
        "奇幻世界，一位年轻的魔法师正在学习控制自己的力量。在一次意外中，他打开了一个通往平行世界的 portal，发现了一个完全不同的自己。"
      ];
      
      // 随机选择一个模拟响应
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        content: randomResponse
      };
    }

    // 生产环境使用真实 OpenAI API
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的小说作家，擅长创作各种类型的小说内容。请根据用户的提示，生成高质量、有创意的小说内容。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0
    });

    return {
      success: true,
      content: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API 错误:', error);
    return {
      success: false,
      error: error.message || '生成内容时出错'
    };
  }
}

// 生成小说标题
export async function generateNovelTitle(prompt, options = {}) {
  try {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
      // 模拟生成标题
      const mockTitles = [
        "勇敢骑士的冒险",
        "火星的秘密",
        "狐仙之恋",
        "看透人心的人",
        "平行世界的魔法师",
        "黑暗森林的传说",
        "未来的希望",
        "古代的浪漫",
        "现代的奇迹",
        "奇幻的旅程"
      ];
      
      // 随机选择一个模拟标题
      const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        title: randomTitle
      };
    }

    // 生产环境使用真实 OpenAI API
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的小说编辑，擅长为小说创作吸引人的标题。请根据用户的提示，生成3-5个高质量、有创意的小说标题。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 100,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0
    });

    return {
      success: true,
      title: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API 错误:', error);
    return {
      success: false,
      error: error.message || '生成标题时出错'
    };
  }
}

// 生成小说大纲
export async function generateNovelOutline(prompt, options = {}) {
  try {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production' || !process.env.OPENAI_API_KEY) {
      // 模拟生成大纲
      const mockOutline = {
        title: "勇敢骑士的冒险",
        chapters: [
          {
            title: "第一章：骑士的使命",
            description: "介绍主角骑士的背景，以及他接到拯救公主的使命"
          },
          {
            title: "第二章：黑暗森林",
            description: "骑士进入黑暗森林，遇到各种危险和挑战"
          },
          {
            title: "第三章：神秘的向导",
            description: "骑士遇到一位神秘的向导，帮助他穿越森林"
          },
          {
            title: "第四章：最终决战",
            description: "骑士与绑架公主的巨龙展开决战"
          },
          {
            title: "第五章：胜利归来",
            description: "骑士成功拯救公主，回到王国"
          }
        ]
      };
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        outline: mockOutline
      };
    }

    // 生产环境使用真实 OpenAI API
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的小说策划师，擅长为小说创作详细的大纲。请根据用户的提示，生成一个包含标题和章节大纲的完整小说大纲。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0
    });

    return {
      success: true,
      outline: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API 错误:', error);
    return {
      success: false,
      error: error.message || '生成大纲时出错'
    };
  }
}
