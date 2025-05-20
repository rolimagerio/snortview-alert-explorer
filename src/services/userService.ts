
import { User } from "@/types/auth";

// Mock user data
const mockUsers: User[] = [
  { id: 1, username: "admin", email: "admin@example.com", isActive: true },
  { id: 2, username: "user1", email: "user1@example.com", isActive: true },
  { id: 3, username: "user2", email: "user2@example.com", isActive: false },
  { id: 4, username: "analyst", email: "analyst@example.com", isActive: true },
  { id: 5, username: "security", email: "security@example.com", isActive: false },
];

// Simulate fetching users from an API
export const fetchUsers = async (): Promise<User[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockUsers];
};

// Simulate updating a user's status
export const updateUserStatus = async (userId: number, isActive: boolean): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In a real application, this would make an API call to update the user status
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], isActive };
  } else {
    throw new Error("User not found");
  }
};

// Simulate deleting a user
export const deleteUser = async (userId: number): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In a real application, this would make an API call to delete the user
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
  } else {
    throw new Error("User not found");
  }
};
