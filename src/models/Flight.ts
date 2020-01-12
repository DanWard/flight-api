import { Length, IsDate } from "class-validator";

export class Flight {

    /**
     * Given flight number and IATA airline code, for example XYZ12.
     */
    @Length(3, 8)
    public flightNumber!: string;

    /**
     * IATA location that the flight departed from.
     */
    @Length(3)
    public departurePort!: string;

    /**
     * IATA location that the flight will arive in.
     */
    @Length(3)
    public arrivalPort!: string;

    /**
     * Time of departure.
     */
    @IsDate()
    public departureTime!: Date;

    /**
     * Time of arrival.
     */
    @IsDate()
    public arrivalTime!: Date;

}