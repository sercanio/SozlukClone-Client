import AuthorsService from "@/services/authorsService/authorsService";
import { Session } from "next-auth/core/types";

interface Props {
    session: Session;
    ownerId?: number;
    roles?: string[]
}

export default async function Guard({ session, ownerId, roles }: Props) {
    try {
        if (!session) {
            throw new Error("Unauthorized: User not authenticated");
        }

        const authorService = new AuthorsService(session);
        const visitor = await authorService.getByUserName(session.user.name as string);
        const self = visitor.id === ownerId;

        if (roles?.some(role => !Object.keys(RoleEnum).includes(role))) {
            throw new Error(`Invalid role(s) provided: ${roles.join(', ')}`);
        }

        const userRoles = roles?.map(role => RoleEnum[role as keyof typeof RoleEnum]);

        return self || userRoles?.includes(visitor.authorGroupId)
    } catch (error) {
        console.error("Guard Error:", error);
        return false;
    }
}

export const RoleEnum: { [key: string]: number } = {
    Developer: 1,
    SuperAdmin: 2,
    Admin: 3,
    SuperModerator: 4,
    Moderator: 5,
    Editor: 6,
    Author: 7,
    Noob: 8,
    Suspended: 9,
    Banned: 10
};
