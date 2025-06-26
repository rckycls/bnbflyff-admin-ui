import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';

type GuildRenameProps = {
  m_idGuild: string;
  m_szGuild: string;
};

const GuildRenameModal: React.FC<GuildRenameProps> = ({
  m_idGuild,
  m_szGuild,
}) => {
  const [newName, setNewName] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: (name: string) =>
      axiosClient.patch(`/auth/guilds/${m_idGuild}`, {
        m_szGuild: name,
      }),
    onSuccess: () => {
      alert('Guild renamed successfully!');
    },
    onError: () => {
      alert('Failed to rename guild.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    mutate(newName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Current Guild Name</label>
        <div className="mt-1 p-2 bg-gray-100 rounded">{m_szGuild}</div>
      </div>

      <div>
        <label className="block text-sm font-medium">New Name</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter new name"
        />
      </div>

      <div className="w-full flex items-end justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand/50 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? 'Renaming...' : 'Rename'}
        </button>
      </div>
    </form>
  );
};

export default GuildRenameModal;
