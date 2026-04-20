import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import CreateProject from "@/pages/CreateProject";
import ProjectEditor from "@/pages/ProjectEditor";
import ProjectSettings from "@/pages/ProjectSettings";
import ProjectVersions from "@/pages/ProjectVersions";
import ProjectExport from "@/pages/ProjectExport";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/project/:id" element={<ProjectEditor />} />
        <Route path="/project/:id/settings" element={<ProjectSettings />} />
        <Route path="/project/:id/versions" element={<ProjectVersions />} />
        <Route path="/project/:id/export" element={<ProjectExport />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
