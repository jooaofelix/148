import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a 148 coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <section className="on-paper bg-paper py-16 text-ink sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">Legal</span>
          <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="text-sm text-ink/50">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
        </div>

        <div className="flex flex-col gap-6 text-base leading-relaxed text-ink/75">
          <p>
            Esta política explica como a 148 coleta e trata os dados pessoais de quem entra na
            nossa fila de espera, em conformidade com a Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018 — LGPD).
          </p>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">
              1. Quais dados coletamos
            </h2>
            <p>
              Ao entrar na fila de espera, coletamos nome, e-mail, número de WhatsApp e,
              opcionalmente, o tamanho de camiseta que você costuma usar. Também registramos a
              data do cadastro, a página de origem, o produto de interesse (quando aplicável) e
              parâmetros de campanha (UTM), para entender como você chegou até nós.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">
              2. Para que usamos esses dados
            </h2>
            <p>
              Usamos seus dados exclusivamente para: avisar sobre o lançamento e novidades da
              148; entender a demanda por cada peça; e, quando aplicável, priorizar sua
              comunicação como parte da fila de espera. Não vendemos nem compartilhamos seus
              dados com terceiros para fins de marketing alheio à 148.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">3. Base legal</h2>
            <p>
              Tratamos seus dados com base no seu consentimento, dado explicitamente ao marcar a
              caixa de aceite no formulário de cadastro.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">4. Seus direitos</h2>
            <p>
              Você pode, a qualquer momento, solicitar acesso, correção, exportação ou exclusão
              dos seus dados, além de revogar seu consentimento. Basta entrar em contato pelo
              e-mail{" "}
              <a href={`mailto:contato@${site.domain}`} className="underline underline-offset-4">
                contato@{site.domain}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">5. Armazenamento e segurança</h2>
            <p>
              Seus dados ficam armazenados em ambiente controlado, sem exposição pública direta,
              e são acessados apenas pela equipe responsável pela comunicação do lançamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
