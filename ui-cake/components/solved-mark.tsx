import { dateFormat } from "@/lib/date"
import { SolvedBy } from "@/recoil/tasks";

type SolvedMarkProps = {
    solved_by: SolvedBy,
} & React.ComponentProps<'span'>

const SolvedMark = ({solved_by, ...props}:SolvedMarkProps) => {
    return <span title={solved_by.team_name + ' solved this task at ' + dateFormat(solved_by.solved_at)} {...props}>🎂</span>
}

export default SolvedMark;