import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member } from "@/types";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-border transition-all duration-500 group-hover:border-fm-pink group-hover:scale-105">
            <AvatarImage src={member.image} alt={member.role} />
            <AvatarFallback className="bg-muted text-foreground text-lg">
              {member.role.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-fm-pink">
            {member.role}
          </h3>
          <p className="text-xs text-muted-foreground">{member.affiliation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
