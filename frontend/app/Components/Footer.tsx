"use client";
import Image from "next/image";

export default function Footer() {
    return (
        <footer  className="flex flex-col space-y-10 justify-center m-10">

            <div className="flex justify-center space-x-5">
               
                <a href="https://www.linkedin.com/in/leonardo-marcelo-905b6b22b/" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/linkedin-2.png" />
                </a>
                <a href="https://www.instagram.com/leonardomarcelo_dev/?__pwa=1" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
                </a>
            </div>
            <p className="text-center text-white font-medium">&copy; 2022 Company Ltd. All rights reservered.</p>
        </footer>

    );
}