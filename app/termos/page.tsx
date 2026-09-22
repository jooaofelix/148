import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do site da 148.",
};

export default function TermosPage() {
  return (
    <section className="on-paper bg-paper py-16 text-ink sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">Legal</span>
          <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">Termos de Uso</h1>
          <p className="text-sm text-ink/50">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
        </div>

        <div className="flex flex-col gap-6 text-base leading-relaxed text-ink/75">
          <p>
            Este site está em fase de pré-lançamento. Não há venda ativa de produtos, nem
            processamento de pagamentos — apenas apresentação da marca 148 e cadastro em uma
            fila de espera para receber informações sobre o lançamento.
          </p>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">1. Conteúdo</h2>
            <p>
              Nomes, artes, símbolos e textos apresentados neste site são propriedade da 148.
              Nenhuma peça, arte ou conceito exibido pode ser reproduzido comercialmente sem
              autorização.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">2. Preços e disponibilidade</h2>
            <p>
              Nenhum preço, prazo de lançamento ou disponibilidade de estoque é informado nesta
              fase. Qualquer data futura de lançamento será comunicada diretamente aos
              cadastrados na fila de espera.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">3. Fila de espera</h2>
            <p>
              O cadastro na fila de espera não representa uma reserva, compra ou garantia de
              disponibilidade de qualquer peça. Ele apenas registra seu interesse para fins de
              comunicação prioritária.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">4. Alterações</h2>
            <p>
              Estes termos podem ser atualizados conforme o site evolui para uma loja completa.
              A versão vigente estará sempre disponível nesta página.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
