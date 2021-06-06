using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Npgsql;

namespace WPFClient.Connection
{
    public class PgConnection
    {
        private static string Server { get; set; }
        private static string Port { get; set; }
        private static string DataBase { get; set; }
        public static NpgsqlConnection Connection { get; private set; }
        public static string ConnectionString { get; private set; }

        public PgConnection()
        {
            //Connection = new NpgsqlConnection(ConnectionString);
        }

        public static NpgsqlConnection GetConnection(string login, string password)
        {
            Server = Properties.Settings.Default.host;
            Port = Properties.Settings.Default.port;
            DataBase = Properties.Settings.Default.dbName;
            ConnectionString = String.Format(@"Server={0};Port={1};DataBase={2};UID={3};PWD={4}",
                Server, Port, DataBase, login, password);
            Connection = new NpgsqlConnection(ConnectionString);
            if (Connection.State == System.Data.ConnectionState.Open)
                return Connection;
            try
            {
                Connection.Open();
                return Connection;
            }
            catch(Exception e)
            {
                return null;
            }
        }
    }
}
