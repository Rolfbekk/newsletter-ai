"use client";

import { useState } from "react";

interface XUserSelectorProps {
  selectedUsers: string[];
  onUserChange: (users: string[]) => void;
}

const POPULAR_X_USERS = [
  "elonmusk", "sundarpichai", "satyanadella", "tim_cook", "samaltman",
  "naval", "paulg", "marcandreessen", "pmarca", "cdixon",
  "balajis", "vitalikbuterin", "cz_binance", "saylor", "jack",
  "brian_armstrong", "chamath", "jason", "patrickc", "david_perell",
  "shaanvp", "davidrose", "fredwilson", "bhorowitz", "reidhoffman"
];

export default function XUserSelector({ selectedUsers, onUserChange }: XUserSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customUser, setCustomUser] = useState("");

  const filteredUsers = POPULAR_X_USERS.filter(user =>
    user.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedUsers.includes(user)
  );

  const handleUserToggle = (user: string) => {
    if (selectedUsers.includes(user)) {
      onUserChange(selectedUsers.filter(u => u !== user));
    } else {
      onUserChange([...selectedUsers, user]);
    }
  };

  const handleCustomUserAdd = () => {
    const cleanUser = customUser.trim().toLowerCase().replace(/^@/, "");
    if (cleanUser && !selectedUsers.includes(cleanUser)) {
      onUserChange([...selectedUsers, cleanUser]);
      setCustomUser("");
    }
  };

  const handleRemoveUser = (user: string) => {
    onUserChange(selectedUsers.filter(u => u !== user));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose X Influencers</h2>
        <p className="text-gray-600">
          Select the X users whose posts you want to include in your newsletter
        </p>
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Users</h3>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div
                key={user}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full"
              >
                <span className="text-sm font-medium">@{user}</span>
                <button
                  onClick={() => handleRemoveUser(user)}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom User Input */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Custom X User</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customUser}
            onChange={(e) => setCustomUser(e.target.value)}
            placeholder="Enter X username (e.g., 'elonmusk' or '@elonmusk')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleCustomUserAdd()}
          />
          <button
            onClick={handleCustomUserAdd}
            disabled={!customUser.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Popular Users */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Influencers</h3>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search popular X users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredUsers.map((user) => (
            <button
              key={user}
              onClick={() => handleUserToggle(user)}
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="font-medium text-gray-900">@{user}</div>
              <div className="text-xs text-gray-500">
                {user.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </button>
          ))}
        </div>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No users found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Choose 5-10 influential users for diverse perspectives</li>
          <li>• Mix different industries and expertise areas</li>
          <li>• You can add any X user by typing their username</li>
          <li>• Popular users tend to post more frequently</li>
        </ul>
      </div>
    </div>
  );
} 