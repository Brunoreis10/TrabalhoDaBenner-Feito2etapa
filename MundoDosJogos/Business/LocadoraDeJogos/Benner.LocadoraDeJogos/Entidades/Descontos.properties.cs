﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

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
    /// Interface para a tabela DESCONTOS
    /// </summary>
    public partial interface IDescontos : IEntityBase
    {
        
        /// <summary>
        /// CodigoDoDesconto (CODIGODODESCONTO.)
        /// Opcional = N, Invisível = False, Tamanho = 20
        /// </summary>
        [System.CodeDom.Compiler.GeneratedCodeAttribute("BEF Code Generator", "18.2.0.790")]
        string Codigododesconto
        {
            get;
            set;
        }
        
        /// <summary>
        /// Porcentagem (PORCENTAGEM.)
        /// Opcional = N, Invisível = False, Valor Mínimo = , Valor Máximo = , Tipo no Builder = Número
        /// </summary>
        [System.CodeDom.Compiler.GeneratedCodeAttribute("BEF Code Generator", "18.2.0.790")]
        System.Nullable<decimal> Porcentagem
        {
            get;
            set;
        }
    }
    
    /// <summary>
    /// Interface para o DAO para a tabela DESCONTOS
    /// </summary>
    public partial interface IDescontosDao : IBusinessEntityDao<IDescontos>
    {
    }
    
    /// <summary>
    /// DAO para a tabela DESCONTOS
    /// </summary>
    public partial class DescontosDao : BusinessEntityDao<Descontos, IDescontos>, IDescontosDao
    {
        
        public static DescontosDao CreateInstance()
        {
            return CreateInstance<DescontosDao>();
        }
    }
    
    /// <summary>
    /// Descontos
    /// </summary>
    [EntityDefinitionName("DESCONTOS")]
    [DataContract(Namespace = "http://Benner.Tecnologia.Common.DataContracts/2007/09", Name = "EntityBase")]
    public partial class Descontos : BusinessEntity<Descontos>, IDescontos
    {
        
        /// <summary>
        /// Possui constantes para retornarem o nome dos campos definidos no Builder para cada propriedade
        /// </summary>
		public static class FieldNames
		{
			public const string Codigododesconto = "CODIGODODESCONTO";
			public const string Porcentagem = "PORCENTAGEM";
		}

        
        /// <summary>
        /// CodigoDoDesconto (CODIGODODESCONTO.)
        /// Opcional = N, Invisível = False, Tamanho = 20
        /// </summary>
        [System.CodeDom.Compiler.GeneratedCodeAttribute("BEF Code Generator", "18.2.0.790")]
        public string Codigododesconto
        {
            get
            {
                return Fields["CODIGODODESCONTO"] as System.String;
            }
            set
            {
                Fields["CODIGODODESCONTO"] = value;
            }
        }
        
        /// <summary>
        /// Porcentagem (PORCENTAGEM.)
        /// Opcional = N, Invisível = False, Valor Mínimo = , Valor Máximo = , Tipo no Builder = Número
        /// </summary>
        [System.CodeDom.Compiler.GeneratedCodeAttribute("BEF Code Generator", "18.2.0.790")]
        public System.Nullable<decimal> Porcentagem
        {
            get
            {
                return Fields["PORCENTAGEM"] as System.Nullable<System.Decimal>;
            }
            set
            {
                Fields["PORCENTAGEM"] = value;
            }
        }
    }
}