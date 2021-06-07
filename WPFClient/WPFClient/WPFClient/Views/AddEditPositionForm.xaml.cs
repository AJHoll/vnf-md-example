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
        private string sqlCreatePosition = "select cmn_doc.doc_item__insert_record(:idDoc);";
        private string sqlFillPositionFields = "select cmn_doc.doc_item__set_doc(:idPos, :idDoc);" +
                                               "select cmn_doc.doc_item__set_number(:idPos, :number);" +
                                               "select cmn_doc.doc_item__set_caption(:idPos, :caption);" +
                                               "select cmn_doc.doc_item__set_sum(:idPos, :sum::t_money);" +
                                               "select cmn_doc.doc_item__after_edit(:idPos);" +
                                               "select cmn_doc.doc__after_edit(:idDoc);";
        private string sqlDeletePosition = "select cmn_doc.doc_item__delete_record(:idPos);" +
                                           "select cmn_doc.doc__after_edit(:idDoc);";

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
        /// Функция создания новой позиции
        /// </summary>
        /// <returns></returns>
        private int CreatePosition(int docId)
        {
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlCreatePosition, connection))
                    {
                        command.Parameters.AddWithValue("idDoc", docId);
                        using (NpgsqlDataReader reader = command.ExecuteReader())
                        {
                            reader.Read();
                            var id = reader.GetInt32(0);
                            return id;
                        }
                    }
                }
                catch (Exception e)
                {
                    MessageBox.Show($"Не удалось создать новую позицию! {e.Message}",
                        "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            return -1;
        }

        /// <summary>
        /// Функция заполнения полей позиции значениями
        /// </summary>
        /// <param name="idRecordPos"></param>
        /// <param name="idRecordDoc"></param>
        /// <returns></returns>
        private bool FillPositionFields(int idRecordPos, int idRecordDoc)
        {
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlFillPositionFields, connection))
                    {
                        command.Parameters.AddWithValue("idPos", idRecordPos);
                        command.Parameters.AddWithValue("idDoc", idRecordDoc);
                        command.Parameters.AddWithValue("number", tbNumber.Text);
                        command.Parameters.AddWithValue("caption", tbName.Text);
                        var sum = float.Parse(tbSum.Text);
                        command.Parameters.AddWithValue("sum", sum);
                        command.ExecuteNonQuery();
                        return true;
                    }
                }
                catch(Exception e)
                {
                    MessageBox.Show($"Не удалось заполнить поля новой позиции." +
                        $"\r\n{e.Message}" +
                        $"\r\nПозиция будет удалена.");
                }
            }
            return false;
        }

        /// <summary>
        /// Функция удаления позиции
        /// </summary>
        /// <param name="idRecordPos"></param>
        /// <param name="idRecordDoc"></param>
        private void DeletePosition(int idRecordPos, int idRecordDoc)
        {
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlDeletePosition, connection))
                    {
                        command.Parameters.AddWithValue("idPos", idRecordPos);
                        command.Parameters.AddWithValue("idDoc", idRecordDoc);
                        command.ExecuteNonQuery();
                    }
                }
                catch(Exception e)
                {
                    MessageBox.Show($"Не удалось удалить позицию! {e.Message}");
                }
            }
        }

        /// <summary>
        /// Событие кнопки "Назад/Отмена"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnCancel_Click(object sender, RoutedEventArgs e)
        {
            //просто выходим
            NavigationService.GetNavigationService(this).GoBack();
        }

        /// <summary>
        /// Событие кнопки "Создать позицию"/"Сохранить изменения"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnSaveChanges_Click(object sender, RoutedEventArgs e)
        {
            #region Проверки
            if (string.IsNullOrEmpty(tbName.Text) ||
                string.IsNullOrEmpty(tbNumber.Text) ||
                string.IsNullOrEmpty(tbSum.Text))
            {
                MessageBox.Show("Заполните все поля!");
                return;
            }
            if (!float.TryParse(tbSum.Text, out float sum))
            {
                MessageBox.Show("Введите число в поле 'Сумма'!");
                tbSum.Text = "";
                return;
            }
            #endregion
            //если создание новой позиции
            if (DocsWindow.isAddPos)
            {
                //создать новую позицию
                int idRecord = CreatePosition(DocsWindow.SelectedDocument.Id);
                if (idRecord != -1)
                {
                    //заполнить поля новой позиции
                    //если поля не были заполнены
                    if (!FillPositionFields(idRecord, DocsWindow.SelectedDocument.Id))
                        //удалить позицию
                        DeletePosition(idRecord, DocsWindow.SelectedDocument.Id);
                    //вернуться на форму с документами и позициями
                    NavigationService.GetNavigationService(this).GoBack();
                }
                else
                    MessageBox.Show("Позиция не была создана! Попробуйте ещё раз", "ERROR",
                        MessageBoxButton.OK, MessageBoxImage.Error);
            }
            //если редактирование позиции
            else
            {
                //изменить выбранную позицию
                FillPositionFields(DocsWindow.SelectedPosition.Id, DocsWindow.SelectedDocument.Id);
                //вернуться на форму с документами и позициями
                NavigationService.GetNavigationService(this).GoBack();
            }
        }
    }
}
