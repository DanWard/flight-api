import { Length, IsDate } from "class-validator";

export class Flight {

    @Length(3, 8)
    public flightNumber!: string;
    @Length(3)
    public departurePort!: string;
    @Length(3)
    public arrivalPort!: string;
    @IsDate()
    public departureTime!: Date;
    @IsDate()
    public arrivalTime!: Date;

}