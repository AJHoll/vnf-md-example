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
using WPFClient.Connection;
using Npgsql;

namespace WPFClient.Views
{
    /// <summary>
    /// Логика взаимодействия для AddEditPositionForm.xaml
    /// </summary>
    public partial class AddEditPositionForm : Page
    {
        private NpgsqlConnection connection;

        public AddEditPositionForm()
        {
            connection = PgConnection.Connection;
            InitializeComponent();
            if (DocsWindow.isAddPos)
            {
                tblockHeader.Text = "Создать новую позицию";
                btnCancel.Content = "Отмена";
                btnSaveChanges.Content = "Создать позицию";
            }
            else
            {
                tblockHeader.Text = "Редактировать позицию";
                btnCancel.Content = "Назад";
                btnSaveChanges.Content = "Сохранить изменения";
                tbNumber.Text = DocsWindow.SelectedPosition.Number;
                tbName.Text = DocsWindow.SelectedPosition.Name;
                tbSum.Text = DocsWindow.SelectedPosition.Sum.ToString();
            }
        }

        /// <summary>
        /// Событие нажатия кнопки "Назад/Отмена"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnCancel_Click(object sender, RoutedEventArgs e)
        {
            //просто выходим
            NavigationService.GetNavigationService(this).GoBack();
        }
    }
}
