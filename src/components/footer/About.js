import React from 'react';
import '../../style/About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>Sobre a MICHSTORE</h1>
                <div className="about-subtitle">
                    O seu marketplace pessoal de produtos selecionados
                </div>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <h2>Quem Sou</h2>
                    <p>
                        Olá! Sou o Miguel, proprietário da MICHSTORE. Criei esta plataforma em 2023 
                        com o objetivo de oferecer produtos selecionados e de qualidade. Todos os 
                        produtos disponíveis são cuidadosamente escolhidos e verificados por mim, 
                        garantindo assim a melhor experiência para você, cliente.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Como Funciona</h2>
                    <div className="process-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Seleção</h3>
                            <p>Seleciono pessoalmente cada produto disponibilizado</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Verificação</h3>
                            <p>Verifico a qualidade e estado de cada item</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Publicação</h3>
                            <p>Fotografo e publico com descrições detalhadas</p>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Entrega</h3>
                            <p>Envio seguro para todo o país</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Compromisso</h2>
                    <p>
                        Meu compromisso é oferecer produtos de qualidade a preços justos. Cada item 
                        é verificado pessoalmente antes de ser disponibilizado na loja, garantindo 
                        assim a satisfação dos meus clientes.
                    </p>
                </section>

                <section className="about-section contact-section">
                    <h2>Contacto</h2>
                    <p>
                        Tem alguma dúvida? Entre em contacto comigo através do email 
                        <a href="mailto:info@michstore.pt"> info@michstore.pt</a> ou pelo 
                        telefone <a href="tel:+351912345678">+351 912 345 678</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About; 