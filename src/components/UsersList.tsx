import { User } from "@prisma/client"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function UsersList({ users, currentUser, handleChangeUser }: { users: User[], currentUser: string, handleChangeUser: (id: number, name: string) => void }) {
    const [initialOne, initialTwo] = currentUser.split(' ');
    const initial = initialOne.charAt(0).toUpperCase() + initialTwo.charAt(0).toUpperCase()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {users.map((user) => <DropdownMenuItem onClick={() => handleChangeUser(user.id, user.name)} key={user.id}>{user.name}</DropdownMenuItem>)}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}