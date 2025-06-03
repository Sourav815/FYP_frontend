import React from "react";

interface UserCardProps {
  user: {
    documentId: string;
    Name: string;
    Designation: string;
    Affiliation: string;
    Role: string;
    Description?: string | null;
    Year?: string | null;
    Email?: string | null;
  };
}

const UserCard: React.FC<{ user: UserCardProps["user"] }> = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.Name}`}
            alt={user.Name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.Name}</h2>
          <p className="text-sm text-gray-600">{user.Designation}</p>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p><strong>Document ID:</strong> {user.documentId}</p>
        <p><strong>Affiliation:</strong> {user.Affiliation}</p>
        <p><strong>Role:</strong> {user.Role}</p>
        {user.Email && <p><strong>Email:</strong> {user.Email}</p>}
        {user.Year && <p><strong>Year:</strong> {user.Year}</p>}
        {user.Description && <p><strong>Description:</strong> {user.Description}</p>}
      </div>
    </div>
  );
};

export default UserCard;
