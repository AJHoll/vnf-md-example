using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Npgsql;

namespace WPFClient
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Page
    {
        private NavigationService Navigation { get; set; }
        
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnLogin_Click(object sender, RoutedEventArgs e)
        {
            var login = tbLogin.Text;
            var password = tbPassword.Password;
            //если соединение создано
            if (GetConnection(login, password))
            {
                NavigationService.GetNavigationService(this).Navigate
                    (new Uri("Views/DocsWindow.xaml", UriKind.RelativeOrAbsolute));
            }
            else
            {
                MessageBox.Show("Неверный логин или пароль", "ERROR", MessageBoxButton.OK,
                    MessageBoxImage.Error);
                tbPassword.Password = "";
            }
        }

        private static bool GetConnection(string log, string passw)
        {
            var connection = Connection.PgConnection.GetConnection(log, passw);
            if (connection != null)
                return true;
            return false;
        }
    }
}
