using Benner.Tecnologia.Business;
using Benner.Tecnologia.Common;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;


namespace Benner.LocadoraDeJogos.Entidades
{
    
    
    /// <summary>
    /// Nome da Tabela: PEDIDO.
    /// Essa é uma classe parcial, os atributos, herança e propriedades estão definidos no arquivo Pedido.properties.cs
    /// </summary>
    public partial class Pedido
    {
        public void Pagar(BusinessArgs args)
        {
            var dao = ItenspedidoDao.CreateInstance();
            var crit = new Criteria("A.PEDIDO = :PEDIDO");
            crit.Parameters.Add("PEDIDO", Handle);
            var itens = dao.GetMany(crit);
            Valortotal = itens.Select(x => x.Valortotal).Sum();
            if (DescontoHandle.IsValid())
                Valortotal = Valortotal * ((100-DescontoInstance["PORCENTAGEM"].GetDecimal()) / 100);
            Status = PedidoStatusListaItens.ItemEmPagamento;
            Save();
        }

        public void Aprovar(BusinessArgs args)
        {
            if(Status != PedidoStatusListaItens.ItemEmPagamento)
            {
                throw new BusinessException("Esta compra ainda não está em pagamento");
            }
            ItenspedidoDao dao = ItenspedidoDao.CreateInstance();
            Criteria crit = new Criteria("A.PEDIDO = :PEDIDO");
            crit.Parameters.Add("PEDIDO", Handle);
            var itensPedido = dao.GetMany(crit);
            using (var tc = new TransactionContext()) {
                ProdutosDao produtoDao = ProdutosDao.CreateInstance();
                foreach (var item in itensPedido)
                {
                    var produto = item.ProdutoInstance;
                    produto.Quantidade -= item.Quantidade;
                    if (item.ProdutoInstance.Quantidade < 0)
                        throw new BusinessException($"O produto {item.ProdutoInstance.Nome} não possui estoque.");
                    produtoDao.Save(produto);
                }
                tc.Complete();
            }
            Status = PedidoStatusListaItens.ItemPago;
            Save();
        }
        
        public void Cancelar(BusinessArgs args)
        {
            if(Status != PedidoStatusListaItens.ItemEmPagamento)
            {
                throw new BusinessException("Esta compra ainda não está em pagamento");
            }
            Status = PedidoStatusListaItens.ItemCancelado;
            Save();
        }

        public void InserirDesconto(BusinessArgs args)
        {
            DescontosDao dao = DescontosDao.CreateInstance();
            var entidade = args.DataEntity as Inserirdesconto;
            if (entidade == null) throw new BusinessException("Entidade inválida.");

            Criteria crit = new Criteria("A.CODIGODODESCONTO = :CODIGO");
            crit.Parameters.Add("CODIGO", entidade.CodigoDesconto);
            var desconto = dao.GetFirstOrDefault(crit);

            if (desconto == null) throw new BusinessException("Código de desconto inválido.");

            DescontoHandle = desconto.Handle;
            Save();
        }

    }
}
