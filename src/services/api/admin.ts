"use client";

import apiClient from "@/lib/apiClient";
import { Prisma, User } from "@prisma/client";

const adminSubmissionWithDetails =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: {
      developer: {
        select: { id: true, firstName: true, email: true, image: true },
      },
      challenge: { select: { id: true, title: true } },
    },
  });
export type AdminSubmission = Prisma.SubmissionGetPayload<
  typeof adminSubmissionWithDetails
>;

export const updateUserAsAdmin = async ({
  userId,
  updates,
}: {
  userId: string;
  updates: any;
}): Promise<User> => {
  const { data } = await apiClient.patch<User>(
    `/admin/users/${userId}`,
    updates
  );
  return data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/admin/users");
  return data;
};

export const getAllSubmissions = async (): Promise<AdminSubmission[]> => {
  const { data } = await apiClient.get<AdminSubmission[]>("/admin/submissions");
  return data;
};
