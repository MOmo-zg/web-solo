import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Clock, User, LogOut } from 'lucide-react';

// 模拟项目数据
const mockProjects = [
  {
    id: '1',
    name: '奇幻冒险小说',
    type: '奇幻',
    description: '一个关于勇者拯救世界的故事',
    created_at: '2026-04-15',
    updated_at: '2026-04-18',
  },
  {
    id: '2',
    name: '都市言情小说',
    type: '言情',
    description: '都市男女的爱情故事',
    created_at: '2026-04-10',
    updated_at: '2026-04-17',
  },
  {
    id: '3',
    name: '科幻悬疑小说',
    type: '科幻',
    description: '未来世界的悬疑故事',
    created_at: '2026-04-05',
    updated_at: '2026-04-16',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);

  const handleCreateProject = () => {
    navigate('/create');
  };

  const handleOpenProject = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-[#1a237e] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">小说创作平台</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-[#ffd700] transition-colors">
              <User className="h-5 w-5" />
              <span>我的资料</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-[#ffd700] transition-colors">
              <LogOut className="h-5 w-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和创建按钮 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">我的小说项目</h1>
          <button
            onClick={handleCreateProject}
            className="bg-[#ffd700] text-[#1a237e] px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>创建新项目</span>
          </button>
        </div>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
              onClick={() => handleOpenProject(project.id)}
            >
              <h3 className="text-xl font-bold text-[#1a237e] mb-2">{project.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{project.type}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{project.updated_at}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-end">
                <button className="text-[#1a237e] hover:text-[#ffd700] transition-colors text-sm font-medium">
                  继续创作 →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">还没有小说项目</h3>
            <p className="text-gray-400 mb-6">点击"创建新项目"开始你的创作之旅</p>
            <button
              onClick={handleCreateProject}
              className="bg-[#ffd700] text-[#1a237e] px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
              创建新项目
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;