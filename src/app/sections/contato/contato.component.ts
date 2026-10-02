/* =====================================================================
   CONTATO — formulário que monta, ao vivo, a mensagem de WhatsApp com
   nome, tipo de projeto, metragem e descrição. O botão abre o WhatsApp
   com o texto pronto (nada é enviado sem a pessoa confirmar no app).
   ===================================================================== */
import { Component, ElementRef, ViewEncapsulation, afterNextRender, computed, inject, signal } from '@angular/core';
import { revelar } from '../../core/animacao/revelar';

/** Número do WhatsApp do estúdio (só dígitos, com 55 + DDD). Confirmar com a Laura. */
const WHATSAPP = '5562999089000';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ContatoComponent {
  private el = inject(ElementRef<HTMLElement>);
  protected tipos = ['Casa', 'Apartamento', 'Quarto infantil', 'Comercial ou gastronomia', 'Vale-projeto para presentear'];
  protected nome = signal('');
  protected tipo = signal('Casa');
  protected m2 = signal('');
  protected msg = signal('');

  protected mensagem = computed(() =>
    `Olá, Laura! Sou ${this.nome() || '[seu nome]'}.\n` +
    `Projeto: ${this.tipo()}${this.m2() ? ' · ' + this.m2() : ''}.\n` +
    `${this.msg() || 'Gostaria de conversar sobre um projeto.'}`);

  protected link = computed(() => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(this.mensagem())}`);

  protected enviar(e: Event) { e.preventDefault(); }

  constructor() {
    afterNextRender(() => revelar(this.el.nativeElement));
  }
}
