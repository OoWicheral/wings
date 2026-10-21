import "./Card.css"
import * as React from "react";


interface CardProps {
    children: React.ReactNode;
}

export default function Card({children}: CardProps ) {

    return (
        <section className="card">
            {children}
        </section>
    )
}