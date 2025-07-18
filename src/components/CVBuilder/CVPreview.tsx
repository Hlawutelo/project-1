import React from 'react';
import { CVData } from '../../types/cv';
import { MapPin, Mail, Phone, Globe, Linkedin, Github, Calendar } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, achievements } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {personalInfo.email && (
              <div className="flex items-center justify-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center justify-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center justify-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
          <div className="mt-2 flex justify-center space-x-4 text-xs">
            {personalInfo.website && (
              <a href={personalInfo.website} className="flex items-center space-x-1 text-blue-600">
                <Globe className="w-3 h-3" />
                <span>Website</span>
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} className="flex items-center space-x-1 text-blue-600">
                <Linkedin className="w-3 h-3" />
                <span>LinkedIn</span>
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} className="flex items-center space-x-1 text-blue-600">
                <Github className="w-3 h-3" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-blue-600">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>• {achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-blue-600">{edu.institution} • {edu.location}</p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="space-y-3">
              {skills.map((category, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-800 text-sm">{category.category}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <a href={project.url} className="text-xs text-blue-600 hover:underline">
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-medium text-gray-900 text-sm">{cert.name}</h3>
                  <p className="text-xs text-gray-600">{cert.issuer} • {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Languages</h2>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  <span className="text-gray-600 ml-2">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};