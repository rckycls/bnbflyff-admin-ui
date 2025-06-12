import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { UpdateCharacterFormType } from "../../types/CharacterType";
import axiosClient from "../../api/axiosClient";

const UpdateCharacter: React.FC = () => {
  const { m_idPlayer } = useParams();

  const form = useForm<UpdateCharacterFormType>();

  const mutation = useMutation({
    mutationFn: (data: UpdateCharacterFormType) =>
      axiosClient.put(`/auth/characters/${m_idPlayer}`, data),
  });

  const onSubmit = (data: UpdateCharacterFormType) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    axiosClient.get(`/auth/characters/id/${m_idPlayer}`).then((res) => {
      form.reset({
        m_szName: res.data.result.m_szName,
        m_vScale_x: res.data.result.m_vScale_x,
      });
    });
  }, [m_idPlayer, form]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 p-4 max-w-md mx-auto"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Character Name</label>
        <input
          type="text"
          {...form.register("m_szName")}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Scale X</label>
        <input
          type="number"
          step="any"
          {...form.register("m_vScale_x")}
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-brand text-white px-4 py-2 rounded hover:opacity-80"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Updating..." : "Update Character"}
      </button>
      {mutation.isError && <p className="text-red-500 mt-2">Update failed.</p>}
      {mutation.isSuccess && (
        <p className="text-green-500 mt-2">Character updated successfully!</p>
      )}
    </form>
  );
};

export default UpdateCharacter;
