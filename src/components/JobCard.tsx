import { GetJobSchema } from "../schemas/jobSchema"
import { Button } from "./Button"
import { MapPin, Briefcase, Banknote, Earth } from "lucide-react"


export function JobCard(Props: GetJobSchema) {
    return (
        <div className="border shadow-lg rounded-lg px-5 py-4">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-lg font-semibold flex items-center gap-1"> <Briefcase className="inline pr-1" />{Props.title}</h1>
                    <p className="text-gray-500 flex items-center gap-1 text-sm">{Props.company}</p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                    <p className="text-sm text-gray-500 items-center"><MapPin className="inline pr-1" />{Props.location}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Earth className="inline pr-1" />{Props.area}
                    </p>
                </div>
                <div className="flex flex-row justify-between items-center mt-5 border-t pt-2">
                    <p className="text-sm text-gray-500">
                        <Banknote className="inline pr-1" />{Props.salary ? `R$ ${Props.salary.toFixed(2)}` : 'Salário não informado'}
                    </p>
                    <Button size="sm">Detalhes</Button>
                </div>
            </div>
        </div>
    )
}