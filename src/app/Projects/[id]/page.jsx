import React from 'react';
import ProjectsDetail from '../../components/ProjectsDetail';
import Sidebar from '../../components/Sidebar';

const ProjectDetailPage = ({ params }) => {
  const { id } = params;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#1a1718] text-white">
      {/* bloque 1 */}
      <div className="w-full lg:w-1/5">
        <Sidebar />
      </div>

      {/* bloque 2 */}
      <div className="flex-1 w-full py-4">
        <div className="w-full px-4 md:px-6 lg:w-5/6 mx-auto">
          <ProjectsDetail projectId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 