using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Benner.Tecnologia.Wes.Components.Mvc;
using Owin;

namespace WebApp
{
    /// <summary>
    /// Summary description for Startup
    /// </summary>
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HostingEnvironment.RegisterVirtualPathProvider(new EntityViewPathProvider());
            AreaRegistration.RegisterAllAreas();
            WebApiConfig.Register(GlobalConfiguration.Configuration, RouteTable.Routes);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            SwaggerConfig.Register();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            var startup20 = this as IStartup20;
            if (startup20 != null)
                startup20.Configuration20(app);

            var startup30 = this as IStartup30;
            if (startup30 != null)
                startup30.Configuration30(app);

            var startup40 = this as IStartup40;
            if (startup40 != null)
                startup40.Configuration40(app);

            var startup50 = this as IStartup50;
            if (startup50 != null)
                startup50.Configuration50(app);
        }
    }

    public interface IStartup20
    {
        void Configuration20(IAppBuilder app);
    }
    public interface IStartup30
    {
        void Configuration30(IAppBuilder app);
    }
    public interface IStartup40
    {
        void Configuration40(IAppBuilder app);
    }
    public interface IStartup50
    {
        void Configuration50(IAppBuilder app);
    }
}//Removido 
