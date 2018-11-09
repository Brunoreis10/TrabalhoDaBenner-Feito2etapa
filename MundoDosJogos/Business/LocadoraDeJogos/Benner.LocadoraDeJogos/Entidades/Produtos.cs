using Benner.Tecnologia.Business;
using Benner.Tecnologia.Common;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;


namespace Benner.LocadoraDeJogos.Entidades
{
    
    
    /// <summary>
    /// Nome da Tabela: PRODUTOS.
    /// Essa é uma classe parcial, os atributos, herança e propriedades estão definidos no arquivo Produtos.properties.cs
    /// </summary>
    public partial class Produtos
    {
        public void AdicionarAoCarrinho(BusinessArgs args)
        {
            PedidoDao pedidoDao;
            var pedido = GarantePedidoCriado(out pedidoDao);
            pedido = GarantePedidoCriado(out pedidoDao);
            var dao = ItenspedidoDao.CreateInstance();
            var c = new Criteria("A.PRODUTO = :HANDLE AND A.PEDIDO = :PEDIDO");
            c.Parameters.Add("HANDLE", Handle);
            c.Parameters.Add("PEDIDO", pedido.Handle);
            var itemPedido = dao.GetFirstOrDefault(c);
            if(itemPedido != null)
            {
                itemPedido.Quantidade++;
                itemPedido.Valortotal = itemPedido.Quantidade * Preco;
                dao.Save(itemPedido);
                args.Message = "Produto já existente. Foi incrementado a sua quantidade.";
            } else
            {
                itemPedido = dao.Create();
                itemPedido.Quantidade = 1;
                itemPedido.Valortotal = Preco;
                itemPedido.PedidoHandle = pedido.Handle;
                itemPedido.ProdutoHandle = Handle;
                dao.Save(itemPedido);
                args.Message = "Produto adicionado ao carrinho.";
            }
            pedido.Valortotal += itemPedido.Valortotal.Value;
            pedidoDao.Save(pedido);
        }

        private IPedido GarantePedidoCriado(out PedidoDao pedidoDao)
        {
            var c = new Criteria("A.STATUS = 1 AND A.CLIENTE IN (SELECT HANDLE FROM PESSOAS WHERE USUARIO = @USUARIO)");
            var dao = PedidoDao.CreateInstance();
            var pedido = dao.GetFirstOrDefault(c);
            if(pedido == null)
            {
                pedido = dao.Create();
                pedido.Status = PedidoStatusListaItens.ItemEmProcessamento;
                var daoCliente = PessoasDao.CreateInstance();
                c = new Criteria("A.USUARIO  = @USUARIO");
                pedido.ClienteHandle = daoCliente.GetFirstOrDefault(c).Handle;
                dao.Save(pedido);
            }
            pedidoDao = dao;
            return pedido;
        }

        public void Ativar(BusinessArgs args)
        {
            if (Ativo.Value)
            {
                throw new BusinessException("Este jogo já está ativo!");
            }
            this.Ativo = true;
            this.Observacoes += $"Jogo ativado em {DateTime.Now.ToString("dd/MM/yyyy hh:mm")}.\n";
            Save();
            args.Message = "Jogo ativado com sucesso!";
        }

        public void Desativar(BusinessArgs args)
        {            
            if (Ativo.Value)
            {
                throw new BusinessException("Este jogo não pode ser desativado pois já está ativado!");
            }
            this.Ativo = false;
            this.Observacoes += $"Jogo desativado em {DateTime.Now.ToString("dd/MM/yyyy hh:mm")}.\n";
            Save();
        }
    }
}
